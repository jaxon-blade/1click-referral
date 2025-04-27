import {
  Box,
  Card,
  DataTable,
  InlineStack,
  Page,
  Pagination,
  Text,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";

// Constants
const ITEMS_PER_PAGE = 10;

export const loader = async ({ request }) => {
  const sessions = await authenticate.admin(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const totalCount = await prisma.referralsUsed.count({
    where: { shop: sessions.session.shop },
  });

  const referralsUsed = await prisma.referralsUsed.findMany({
    where: { shop: sessions.session.shop },
    orderBy: { createdAt: "asc" },
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  return {
    referralsUsed,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
  };
};

const ReferralProgram = () => {
  const {
    referralsUsed,
    totalCount,
    currentPage: initialPage,
    totalPages,
  } = useLoaderData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Sync currentPage with URL when it changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", currentPage.toString());
    setSearchParams(newParams);
  }, [currentPage, searchParams, setSearchParams]);

  const rows = referralsUsed.map((referral) => [
    referral.advocateEmail || "N/A",
    referral.referredFriendsCount || 0,
    referral.salesFromReferral || 0,
    referral.createdAt
      ? new Date(referral.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A",
  ]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!referralsUsed || referralsUsed.length === 0) {
    return (
      <Page
        title="Referral Report"
        backAction={{
          content: "Back",
          onAction: () => navigate("/app"),
        }}
      >
        <Card>
          <InlineStack align="center" blockAlign="center" vertical>
            <Box aria-activedescendant="no-record-found" minHeight="100px">
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  display: "grid",
                  placeContent: "center",
                }}
              >
                <Text variant="headingLg">No record found</Text>
                <Text variant="bodyLg">Waiting for some to place order</Text>
              </div>
            </Box>
          </InlineStack>
        </Card>
      </Page>
    );
  }
  return (
    <Page
      title="Referral Report"
      backAction={{
        content: "Back",
        onAction: () => navigate("/app"),
      }}
    >
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "numeric", "text"]}
          headings={["Advocate", "Referred friend", "Sales", "Created At"]}
          rows={rows}
          footerContent={`Showing ${referralsUsed.length} of ${totalCount} results`}
        />
        <div
          style={{ padding: "1rem", display: "flex", justifyContent: "center" }}
        >
          <Pagination
            hasPrevious={currentPage > 1}
            onPrevious={handlePrevious}
            hasNext={currentPage < totalPages}
            onNext={handleNext}
            label={`${currentPage} of ${totalPages}`}
          />
        </div>
      </Card>
    </Page>
  );
};

export default ReferralProgram;
